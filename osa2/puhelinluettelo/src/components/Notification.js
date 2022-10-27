import {useState} from 'react'

const Notification =({message, id}) => {

    if (message === null) {
        return null
    }

    if (id === "add") {
        return (
            <div className="add">
                {message}
            </div>
        )
    } else if (id === "update") {
        return (
            <div className="update">
                {message}
            </div>
        )
    } else {
        return (
            <div className="remove">
                {message}
            </div>
        )
    }

    

    
}

export default Notification