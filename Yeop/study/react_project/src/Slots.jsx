export default function Slots({val1, val2, val3}){
    const isWin = val1===val2 && val1===val3;
    return (
        <div>
            <h1>
                {val1} {val2} {val3}
            </h1>
            <h2 style = {{color : isWin ? "green" : "red"}}>
                {isWin ? "You win!" : "You lose!"}
            </h2>
            {isWin && <h3>Congrats</h3>}
        </div>
    )
}