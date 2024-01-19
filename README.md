# NodeJS average number endpoint

A basic Node app that provides the average from a range of random numbers that it gathers over time.

## Setup

> ⚠️ Please note: Node 18 or higher is required to support the use of the native fetch method

```bash
npm install
```

## Running in dev

```bash
npm run dev # Will hot-reload automatically using nodemon
```

## Running in prod

### Start

```bash
npm run start # Will restart server automatically in the event of a crash using pm2
```

### Stop

```bash
npm run stop
```

## Usage

When the server is running the average of random numbers collected can be retrieved by `GET` request to http://localhost:3000/average.

It will return a response of

```json
{
  "currentAverage": number
}
```

Based on the random number provider's update frequency the average will not change more than once per second. Numbers are currently not rounded.

## Running tests

```bash
npm run test
```

## Customising the log level

You can customise the verbosity of logs as required by editing the `LOG_LEVEL` env variable in the npm scripts in [package.json](./package.json).

Valid values are one of the following: `trace | debug | info | warn | error | fatal`

## Tradeoffs and design considerations

### Data accuracy

I've increased the frequency of calling the random-number target API to be 4 times a second to ensure higher accuracy and avoid "missed" numbers based on the nature of the business and the mention of "high volumes of critical zero-loss communications" in the job spec.

This frequency can be increased for greater accuracy at the cost of more resources, or vice versa. The tests are written in a way that allows tweaking of the frequency without having to change the tests.

### Reliability

The instructions mention keeping all collected numbers in memory, however this would mean that the server would *eventually* run out of memory and crash which doesn't feel great, so I have changed it to rather just store the average and the amount of numbers processed and update the average based on that.

All numbers received are logged so it would be easy enough to send this somewhere if historical data is needed.

### Further possible improvements

Depending on requirements:
 - I would maybe make a few more things like the port and frequency of the monitor configurable via ENV variables but it didn't seem warranted in this simple use case.
 - I would maybe do some rounding on the average provided by my endpoint