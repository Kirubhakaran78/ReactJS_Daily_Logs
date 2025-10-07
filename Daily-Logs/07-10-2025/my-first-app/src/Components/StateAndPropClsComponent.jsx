import {Component} from "react";

class StateAndPropClsComponent extends Component{
    constructor(){
        super();

        this.state={
            count:0
        };
    }

    increment = ()=>{
        this.setState({count:this.state.count+1});
    }

    decrement=()=>{ //using "arrow functions" because binding automatically or else we need to bind in the "constructor" this.decrement = this.decrement.bind(this);
        this.setState({count:this.state.count-1});
    }

    render(){ //render in the html container
        return(
            <>
            <h3>Hi I am {this.props.name}, and this is my class Component React app</h3>
            <h4>count:{this.state.count}</h4>
            <button onClick={this.increment}>Increment</button>
            <button onClick={this.decrement}>Decrement</button>
            </>
        )
    }

}

export default StateAndPropClsComponent;