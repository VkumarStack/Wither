import React from "react";
import '../Stylesheets/profile.css';
import HeaderBar from './HeaderBar';
import CreatePost from "./CreatePost";
import EditBio from "./EditBio";
import UserInfo from "./UserInfo";
import PostDisplay from "./PostsDisplay";
import Follow  from "./Follow";

class Profile extends React.Component {
    // Assume props is the current user
    constructor(props) {
        super(props);
        this.state = {
            user: sessionStorage.getItem("user"),
            current: window.location.pathname.split("/").pop(),
            bio: "",
            followers: []

            // Fetch the database at the top-level and pass into EditBio and UserInfo as props
            // userinfo contains bio, followers, posts, and username
        };
    }

    componentDidMount() {
        // fetch defaults to a GET request, so no need to specify any other parameters
        fetch(`http://localhost:8080/users/${this.state.current}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if (!data.Error)
                this.setState({bio: data.a_bio, followers: data.a_followers});
        })
    } 

    changeBio(newBio) {
        this.setState({bio: newBio});
    }

    updateFollow(newFollowers) {
        this.setState({followers: newFollowers});
    }

    render() {
        let loggedIn = true;
        let theirProfile = false;
        if (sessionStorage.getItem("token") === null){
            loggedIn = false;
        } else {
            if (this.state.user === this.state.current) {
                theirProfile = true;
            }
        }
        return (
            <div className="Profile">
                <HeaderBar></HeaderBar>
                {this.chooseRender(loggedIn, theirProfile)}
            </div>
        )
    }

    chooseRender(loggedIn, theirProfile) {
        const key = `${loggedIn}-${theirProfile}`
        if (key === "false-false")
        {
            return (
                <div className='rowC'>
                    <div className="userinfo-container">
                        <UserInfo bio={this.state.bio} followers={this.state.followers}/>
                    </div>
                    <PostDisplay usernames={[this.state.current]}/>
                </div>
            )
        }
        else if (key === "true-false")
        {
            return (
                <div className='rowC'>
                    <div className="userinfo-container">
                        <UserInfo bio={this.state.bio} followers={this.state.followers}/>
                        <Follow current={this.state.current} followers={this.state.followers} updateFollow={this.updateFollow.bind(this)}/>
                    </div>
                    <PostDisplay usernames={[this.state.current]}/>
                </div>
            )
        }
        else if (key === "true-true")
        {
            return (
                <div className='rowC'>
                    <div className="userinfo-container">
                        <UserInfo bio={this.state.bio} followers={this.state.followers}/>
                        {/* The changeBio function is being passed to the EditBio component, but is being bound
                        to this component  (Profile) - so when changeBio() references "this" in its function, it will refer 
                        to the Profile component's state and not the Edit component's state */}
                        <EditBio changeBio={this.changeBio.bind(this)}/>
                    </div>
                    <div>
                        <CreatePost/>
                        <PostDisplay usernames={[this.state.current]}/>
                    </div>
                </div>
            )
        }
        else 
            return null;
    }
}

export default Profile;