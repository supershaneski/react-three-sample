export default function ThreeObject(props) {
    return (
        <div 
        id={`${props.id}`} 
        style={{
            display: 'none',
        }}
        />
    )
}
ThreeObject.defaultProps = {
    id: undefined,
}