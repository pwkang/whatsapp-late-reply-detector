import React from 'react';
import {Box, Grid, Stack, Typography} from '@mui/material';
import ms from 'ms';
import {DateTime} from 'luxon';
import {reportItem} from "./App";

const msToTime = (milis: number) => {
  let day = 0;
  let hour = 0;
  let minute = 0;
  let time = [];
  if (milis >= ms('1d')) {
    day = Math.floor(milis / ms('1d'));
    milis -= ms(`${day}d`);
    time.push(`${day}d`);
  }
  if (milis >= ms('1h') || day) {
    hour = Math.floor(milis / ms('1h'));
    milis -= ms(`${hour}h`);
    time.push(`${hour}h`);
  }
  if (milis >= ms('1m') || hour) {
    minute = Math.floor(milis / ms('1m'));
    milis -= ms(`${minute}m`);
    time.push(`${minute}m`);
  }

  return time.join(' ');
};

type ReportProps = {
  messages: reportItem[],
}

function Report({messages = []}: ReportProps) {
  return (
    <>
      <Stack
        sx={{
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 1,
          padding: 2,
        }}
        spacing={1}
      >
        <Typography>Total Late Reply: {messages.length}</Typography>
      </Stack>
      <div className="grid grid-cols-1 gap-4">
        {messages.map((message, i) => (
          <Stack
            key={i}
            sx={{
              border: 1,
              borderColor: 'grey.300',
              borderRadius: 1,
              padding: 2,
            }}
            spacing={2}
          >
            {message.messages.map((msg, j) => (
              <Box key={j} sx={{
                backgroundColor: j === 2 ? '#f4e385' : 'none',
                borderRadius: 1,
                paddingX: 2,
                paddingY: 0.5,
              }}>
                <Typography
                  sx={{
                    fontSize: 16,
                    color: 'grey.600',
                  }}
                >
                  {DateTime.fromMillis(msg.date).toFormat('f a')}
                </Typography>
                <Typography sx={{
                  wordBreak: 'break-word',
                }}>{msg.content}</Typography>
              </Box>
            ))}
            <Box
              sx={{
                mt: 2,
              }}
            >
              <Typography>{msToTime(message.responseIn)}</Typography>
            </Box>
          </Stack>
        ))}
      </div>
    </>
  );
}

export default Report;
