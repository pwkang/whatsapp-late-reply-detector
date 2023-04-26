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
  console.log(messages);
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
        <Typography>Employee Name:</Typography>
        <Typography>Total Late Reply:{messages.length}</Typography>
        <Typography>
          This is the person who talks the most in the group
        </Typography>
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
              <div key={j} className="w-full mb-2">
                <Typography
                  sx={{
                    fontSize: 16,
                    color: 'grey.600',
                  }}
                >
                  {DateTime.fromMillis(msg.date).toFormat('f a')}
                </Typography>
                <Typography>{msg.content}</Typography>
              </div>
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
