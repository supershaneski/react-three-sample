import React from 'react';
import Header from './header';
import Footer from './footer';

class Clock extends React.Component {
    constructor() {
        super()
        this.timer = null;
        this.state = {
            time: new Date()
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                time: new Date()
            })
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        return (
            <>
            <span>
            {
            this.state.time.toLocaleTimeString()
            }
            </span>
            <style jsx>
            {`
            span {
                color: #cecece;
            }
            `}
            </style>
            </>
        )
    }
}

const withLayout = Page => {
    return () => (
        <>
        <Header />
        <Clock />
        <main style={{
            backgroundColor: 'white',
            borderRadius: '4px',
            padding: '10px 0px 12px 0px',
        }}>
            <Page />
        </main>
        <Clock />
        <Footer />
        </>
    )
}
export default withLayout;
