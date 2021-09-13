import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import axios from "axios";

function AuthFacts() {
  const [quotes, setQuotes] = useState();
  const styles = useSpring({
    opacity: quotes ? 1 : 0,
    delay: 200,
    textAlign: "center",
  });

  useEffect(() => {
    axios
      .get("http://numbersapi.com/random")
      .then((res) => setQuotes(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div id="auth__background">
      <animated.div style={styles}>
        <span className="display-3">
          <i className="far fa-surprise"></i>
        </span>
        <h2 className="h2 p-2">Intresting Facts about numbers</h2>
        <p className="lead p-2">{quotes}</p>
      </animated.div>
    </div>
  );
}

export default AuthFacts;
