const React = require('react');

class PetItem extends React.Component{
    render(){
        return(
            <div id="inItem" className="foodItem"> 
                <img src={this.props.image}></img>
                <br />
                Quantity: {this.props.qty}
            </div>
        );
    }
}

class MyInventory extends React.Component {
	constructor(props){
        super();
        const maxQty = props.inventory.reduce((acc, elem) => {
            acc[elem.name] = parseInt(elem.quantity);
            return acc
        }, {});
		this.state = {
            maxQty: maxQty,
			inventory: props.inventory
        }
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(){
        const newVal = document.querySelector("#foodFeed").value;
        document.querySelector("#foodQty").max = this.state.maxQty[newVal];
    }

	render() {
		const itemArray = this.state.inventory.map((item, index) => {
			const itemImg = `/img/${item.name}.png`;
			return (<PetItem image={itemImg} qty={item.quantity} key={index}/>)
        });
        
        const formOptions = [];
        let maxQ = null;
        let k = 0;
        for (const food in this.state.maxQty){
            if (this.state.maxQty[food] !== 0){
                formOptions.push(<option value={food} key={k}>{food}</option>);
                if (maxQ === null){
                    maxQ = this.state.maxQty[food];
                }
                ++k;
            }
        }

        if (formOptions.length === 0){
            return(
                <React.Fragment>
                {itemArray}
                <br />
                <form method="POST">
                    <div className="form-group">
                    Buy some food first to feed your pet!
                    </div>
                </form>
                </React.Fragment>
            )
        }

		return (
			<React.Fragment>
                {itemArray}
                <br />
                <form method="POST">
                    <div className="form-group">
                    Feed:
                    <select className="form-control" id="foodFeed" name="foodFeed" onChange={this.handleChange}>
                        {formOptions}
                    </select>
                    Quantity:<input id="foodQty" type="number" name="qty" min="1" max={maxQ}/>
                    </div>
                    <button className="btn btn-primary" type="submit">Feed!</button>
                </form>
			</React.Fragment>
		);
	}
}
module.exports = MyInventory;