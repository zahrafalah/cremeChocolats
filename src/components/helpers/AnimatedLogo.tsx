import * as React from "react";

const images = [
  require("../../../static/assets/images/animated-logo/animated-logo-1.png"),
  require("../../../static/assets/images/animated-logo/animated-logo-2.png"),
  require("../../../static/assets/images/animated-logo/animated-logo-3.png"),
  require("../../../static/assets/images/animated-logo/animated-logo-4.png"),
  require("../../../static/assets/images/animated-logo/animated-logo-5.png"),
  require("../../../static/assets/images/animated-logo/animated-logo-6.png"),
  require("../../../static/assets/images/animated-logo/animated-logo-7.png"),
  require("../../../static/assets/images/animated-logo/animated-logo-8.png"),
];

type Props = {
  width?: string;
  height?: string;
};
export const AnimatedLogo = ({ width = "auto", height = "auto" }: Props) => {
  const [second, setSecond] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSecond((previousSecond) =>
        previousSecond === 6 ? 0 : previousSecond + 1
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in flex-center" style={{ position: "relative" }}>
      {images.map((image, index) => (
        <img
          src={image}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height,
            width,
            opacity: index === second ? 1 : 0.15,
            transition: "opacity 1s ease-in-out",
          }}
          key={index}
        />
      ))}
    </div>
  );
};
