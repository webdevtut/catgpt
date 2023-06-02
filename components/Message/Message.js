export const Message = ({role, content}) => {
    return <div className="grid grid-cols-[30px_1fr] gap-5 p-5">
        <div>avatar</div>
        <div>{content}</div>
    </div>
}