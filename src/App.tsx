import React, {useRef, useState} from 'react';
import {Box, Button, Grid, IconButton, List, ListItem, ListItemText} from '@mui/material';
import useFormat from './validation/format';
import validateDate from './validation/validateDate';
import Report from './Report';
import ms from 'ms';
import DeleteIcon from '@mui/icons-material/Delete';

type processFileProps = {
  txtArr: string[],
  format: string,
}

type historyItem = {
  date: number,
  content: string,
  originalText: string,
  dreamory: boolean,
}

type processedFile = {
  content: string[],
  history: historyItem[],
}

function processFile({txtArr, format}: processFileProps): processedFile {
  const history: historyItem[] = [];

  for (let i = 0; i < txtArr.length; i++) {
    const line = txtArr[i];
    const validation = validateDate({
      content: line,
      format,
    });
    if (validation.isValid) {
      history.push({
        date: validation.timestamp,
        content: validation.content,
        originalText: line,
        dreamory: validation.content.includes('@ Dreamory'),
      });
    } else {
      const lastHistory = history[history.length - 1];
      if (lastHistory) {
        lastHistory.content += `\n${line}`;
        lastHistory.originalText += `\n${line}`;
      }
    }
  }

  return {
    content: txtArr,
    history,
  };
}

export type reportItem = {
  responseIn: number,
  messages: historyItem[],
}


type File = {
  name: string,
  content: processedFile
}

type FileReportProps = {
  file: File,
  maxDuration: number,
  extraMessages: number,
}

const generateReport = (props: FileReportProps): reportItem[] => {
  if (!props.file) return [];
  const history = props.file.content.history
  const toRecord: reportItem[] = [];
  for (let j = 0; j < history.length; j++) {
    const currMessage = history[j]; // current message
    const prevMessage = history[j - 1]; // previous message
    if (!currMessage.dreamory) continue; // if current message is not dreamory, skip
    if (prevMessage.dreamory) continue; // if previous message is dreamory, skip
    const responseIn = currMessage.date - prevMessage.date;
    if (responseIn < props.maxDuration) continue; // if response time is less than maxDuration, skip
    const firstMessage = Math.max(0, j - props.extraMessages);
    const lastMessage = Math.min(
      j + props.extraMessages + 1,
      history.length - 1,
    );
    toRecord.push({
      responseIn,
      messages: history.slice(firstMessage, lastMessage),
    });
  }
  return toRecord;
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const format = useFormat();
  const [config, setConfig] = useState({
    maxDuration: ms('2h'),
    extraMessages: 2,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    for (let i = 0; i < e.target.files.length; i++) {
      const name = e.target.files[i].name;
      if (files.find((file) => file.name === name)) continue;

      // read txt content
      const reader = new FileReader();
      reader.onload = (e) => {
        const txt: string = e.target?.result as string;

        /*const processed = processFile({txtArr: file.split('\n'), format});
        const newFile = {
          name,
          history: processed.history,
          content: processed.content,
        };*/
        setFiles((prev) => [...prev, {
          name,
          content: processFile({
            txtArr: txt.split('\n'),
            format: format || 'DD/MM/YYYY, h:mm a - ',
          })
        }]);
      };
      reader.readAsText(e.target.files[i]);
    }
    if (inputRef.current)
      inputRef.current.value = '';
  };

  const onAddFileClick = () => {
    if (inputRef.current)
      inputRef.current.click();
  };

  const onRemoveFileClick = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectItem = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
    }}>
      <Grid container spacing={2} sx={{
        p: 2
      }}>
        <Grid item xs={4}>
          <List
            sx={{
              border: '1px solid #ccc',
              paddingY: 0,
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            {files?.map((file, i) => (
              <ListItem
                key={i}
                onClick={() => handleSelectItem(i)}
                sx={{
                  cursor: 'pointer',
                  ...(selectedIndex === i && {
                    backgroundColor: '#0b6ffd',
                    color: 'white',
                  }),
                }}
                secondaryAction={
                  <IconButton onClick={() => onRemoveFileClick(i)}>
                    <DeleteIcon/>
                  </IconButton>
                }
              >
                <ListItemText>{file.name}</ListItemText>
              </ListItem>
            ))}
          </List>
          <Box sx={{
            display: 'flex',
            mt: 2,
            justifyContent: 'center',
          }}>
            <Button onClick={onAddFileClick} variant="contained" className="mb-4">
              Add Files
            </Button>
          </Box>
          <input
            ref={inputRef}
            multiple={true}
            accept="text/plain"
            hidden={true}
            type="file"
            onChange={handleFileChange}
          />
        </Grid>
        <Grid item xs={8}>
          <Report messages={generateReport({
            file: files[selectedIndex],
            extraMessages: config.extraMessages,
            maxDuration: config.maxDuration,
          })}/>
        </Grid>
      </Grid>

    </Box>
  );
}

export default App;
