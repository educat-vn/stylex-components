import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {
    BaseInput,
    BaseTextInput,
    FormTextInput,
    BaseFocusRing
} from 'stylex-ui-components';

function App() {
    const [count, setCount] = useState(0)

    const [text, setText] = useState('');

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React + React Aria + Stylex</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>


            {/*
        <div>
            <Checkbox>
                This is a Stylex Checkbox
            </Checkbox>
        </div>
        */}
            <br/>
            <br/>
            <br/>
            <div>
                 <FormTextInput
                 // disabled={true}
                 autoComplete="off"
                 label={"First Name"}
                 placeholder="Type something..."
                 // labelLocation='outside'
                 value={text}
                 onValueChange={setText}
                 helperText="Please input your first name"
                 // onPress={() => console.log('pressed')}
                 // validationState='ERROR'
                 />
            </div>
        </>
    )
}

export default App
