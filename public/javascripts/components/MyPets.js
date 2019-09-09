const React = require('react');

class Pet extends React.Component{
	render(){
		const imgLoc = `/img/${this.props.petImg}`;
		const refLoc = `/pets/${this.props.pId}`;
		return (
			<div className="petContainer">
				<a href={refLoc}>Feed {this.props.name}!</a>
				<br />
				<div className="petImage">
					<img className="listPet" src={imgLoc} />
				</div>
				<div className="petDetail">
					{this.props.name}
					<br />
					Level {this.props.level}
					<br />
					{this.props.xp} XP
				</div>
			</div>
		)
	}
}

class MyPets extends React.Component {
	constructor(props){
		super();
		this.state = {
			petArray: props.pets
		}
	}

	render() {
		const imgArray = this.state.petArray.map((p, index) => {
			let petImg;
			if (p.type === "Kitterpillar"){
				petImg = "kitterpillar.png";
			}
			else if (p.type === "Witchbunny"){
				petImg = "witch.png";
			}
			else if (p.type === "AquaCat"){
				petImg = "rainbowCat.png";
			}
			else if (p.type === "Butterdee"){
				petImg = "phoenix.png";
			}
			else if (p.type === "Hamoo"){
				petImg = "hamster.png";
			}
			else{
				petImg = "birdie.png";
			}
			
			return (<Pet petImg={petImg} name={p.name} level={p.level} xp={p.xp} pId={p._id} key={index}/>)
		});
		return (
			<React.Fragment>
				<h2><a href="/createPet">Adopt a pet!</a></h2>
				<br />
				<br/>
				<h2>List of pets!</h2>
				{imgArray}
			</React.Fragment>
		);
	}
}
module.exports = MyPets;