import './MainHeader.css'

export const MainHeader = (props: {children: JSX.Element[]}) =>{
    return <header className='main-header'>
        {props.children}
    </header>
}