import React from 'react'
import cryptosMap from './cryptos.js'
import Panel from './Panel'

class Graph extends React.Component{
    render(){
        let symbol = cryptosMap[this.props.crypto].symbol + 'USD';
        return(
          <Panel {...this.props} title="Chart">
            <iframe src={`https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=15&hidesidetoolbar=1&symboledit=0&saveimage=1&toolbarbg=rgba(0,0,0,0)&hideideas=1&theme=Dark&timezone=exchange`}
                title={this.props.title}   
                height="500px%"
                width="100%" 
                frameBorder="0"
            />
          </Panel>
        )
    }
}

export default Graph;