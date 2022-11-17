import React, { Component } from "react";

import Content from "../common/content";
import PostMenu from "../common/postmenu";

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.child = React.createRef();
	}

	render() {
		return (
			<div className="container">
				<header className="jumbotron">
					<PostMenu pass={this.child} />
					<Content ref={this.child} visibilityView="Public" pageType="home" />
				</header>
			</div>
		);
	}
}
