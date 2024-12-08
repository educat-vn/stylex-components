import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {
    BaseInput,
    BaseTextInput,
    FormTextInput,
    BaseFocusRing,
    Button,
    BaseButton,
    WebPressable,
    PressableText,
    UserAgent
} from 'stylex-react-components';

console.log('UserAgent.isBrowser("Safari")', UserAgent.isBrowser("Safari"))
console.log('UserAgent.isBrowser("Chrome")', UserAgent.isBrowser("Chrome"))

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
            <br/>
            <br/>
            <br/>
            <Button onPress={() => {
                console.log('clicked')
            }}>
                <span>This is a Stylex Button</span>
            </Button>

            <br/>
            <br/>
            <br/>
            <WebPressable onPress={(e) => console.log('WebPressable', e)}>
                WebPressable
            </WebPressable>
            <br/>
            <br/>
            <br/>
            <PressableText onPress={(e) => console.log('PressableText', e)}>
                PressableText
            </PressableText>
            <br/>
            <br/>
            <br/>
            <BaseButton  onClick={(e) => console.log('BaseButton', e)}>
                BaseButton
            </BaseButton>
        </>
    )
}

export default App
