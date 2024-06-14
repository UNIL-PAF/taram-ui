# Taram user interface

The web interface of Taram is mainly created with [ReactJS](https://react.dev/).

For the layout [Ant Design](https://ant.design/) is used. The plots are generated using [Apache ECharts](https://echarts.apache.org).


## Usage

### Prerequisites

- Node (>= 18.15.0).
- Yarn (>= 1.22.17).

### Configuration

Set the URL to your instance of [Taram backend](https://github.com/UNIL-PAF/taram-backend) API in ```globalConfig.js```:
```globalConfig.urlBackend```

Install node packages:
```yarn install```

### Run a development instance

```yarn run start```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build production app

```yarn build```

Builds the app for production to the `build` folder.
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
