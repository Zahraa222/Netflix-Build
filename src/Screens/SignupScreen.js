import React, { useRef } from "react"; 
import "./SignupScreen.css";
import { auth } from "../firebase";

function SignupScreen() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const register = (e) => {
    /*when a button is inside a form, the page typically refreshes. by adding 'e',it prevents the default behaviour */
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log(authUser);
      })
      .catch((error) => {
        alert(
          error.message
        ); /*if there is an error, a message on the screen will say so */
      });
  };

  const signIn = (e) => {
    e.preventDefault();
  };
  return (
    <div className="signupScreen">
      <form>
        <h1>Sign In</h1>
        <input ref={emailRef} placeholder="Email" type="email" />
        <input ref={passwordRef} placeholder="Password" type="password" />
        <button className="submit" onClick={signIn}>
          Sign In
        </button>
        <h4>
          <span className="graytext">New to Netflix?</span>{" "}
          <span className="signup_Link" onClick={register}>
            Sign Up now.
          </span>
        </h4>
      </form>
    </div>
  );
}

export default SignupScreen;
