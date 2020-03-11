import React from 'react';
import Header from './header';
import Footer from './footer';

const withLayout = Page => {
    return () => (
        <>
        <Header />
        <main style={{
            backgroundColor: 'white',
            borderRadius: '4px',
            padding: '10px 0px 12px 0px',
        }}>
            <Page />
        </main>
        <Footer />
        </>
    )
}
export default withLayout;
