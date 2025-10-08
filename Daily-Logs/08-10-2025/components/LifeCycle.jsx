import React from 'react'

class LifeCycle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            color: "yellow",
            data: null
        };
         this.boxRef=React.createRef();
            this.timerId=0;
        };

    //getDerivedStateFromProps(nextProps,prevState) - before rendering and return object and used to update the state based on prop changes
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.color !== prevState.color) {
            return { color: nextProps.color };
        }
        return null; // if no update
    }

    //componentDidMount() -> called after the component is rendered for the first time
    // used to update Dom and fetching the api calls 
    //Ex: update the state after the component mounted
    componentDidMount() {
        console.log("Component Mounted..!");

        setTimeout(() => {
            this.setState({data : "Data has been Loaded.."})
        }, 2000)

        //  this.timerId=setInterval(()=>{
        //     this.setState((prevState)=>({count:prevState.count+1}));
        // },1000)
    }

    //updating

    //shouldComponentUpdate(nextProps,nextState) -> upcoming state and props
    //return true or false
    shouldComponentUpdate(nextProps,nextState){
        return nextState.count%2===0; //render only if the count is even
    }

    //getSnapshotBeforeUpdate(prevProps,prevState) -> capture the information before the dom gets update

    //runs before componentDidUpdate and return -> any value and passes has the third argument in the componentDidUpdate() or else retrun null default
    //useful to capture the scroll positions and dom measurements and selection ranges 
    getSnapshotBeforeUpdate(prevProps,prevState){
        return this.boxRef.current ? this.boxRef.current.scrollHeight:null;
    }

    //componentDidUpdate(prevProps,prevState,snapshot) -> called after the component updates
    //compares the previous and current state/props
    //use for side effects: api call, dom updates and syncing state with props and
    //not calls on initial mount,only on state or props changes

    //snapshot -> value returned from getSnapshotBeforeUpdate()

    componentDidUpdate(prevProps,prevState,snapshot){
        console.log("previous scroll Height: "+snapshot);
        console.log("prev count: "+prevState.count+"changed to"+this.state.count);
    }

    //Unmounting -> component removed from the dom, once the component is unmounted and it will destroyed and no longer exist in the dom

    //componentWillUnmount() -> called before the component is removed from the dom
    //it is a cleanup phase of a component -> like clearTimeout(), clearInterval(), window.removeEventListeners()
    //called when we hiding the component in conditional rendering
    componentWillUnmount(){
        clearInterval(this.timerId);
        console.log("Cleared timerId..")
    }

    increment = () => {
        this.setState({ count: this.state.count + 1 });
    }

    render() {
        return (
            <>
                <button type='button' onClick={this.increment}>click me</button>
                <h2>{this.state.count}</h2>
                <h2>{this.state.color}</h2>
                <h4>{this.state.data ? this.state.data : "Loading...."}</h4>
                <p ref={this.boxref}></p>
            </>
        );
    }



}

export default LifeCycle;
