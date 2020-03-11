export default function Header() {
    const siteTitle = 'Sandbox'; //process.env.siteTitle;
    return (
        <>
        <header>
            <h1 className="lighter">{ siteTitle }</h1>
        </header>
        <style jsx>
        {`
        h1 {
            text-align: center;
            font-size: 1.8em;
            margin: 0px;
            padding: 0px;
            text-shadow: 1px 1px #fff;
        }
        `}
        </style>
        </>
    )
}
