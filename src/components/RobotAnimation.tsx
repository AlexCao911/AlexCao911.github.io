import "../robot-animation.css";

type RobotAnimationProps = {
  className?: string;
};

export function RobotAnimation({ className = "" }: RobotAnimationProps) {
  const classNames = ["robot-animation", className].filter(Boolean).join(" ");

  return (
    <div className={classNames} aria-hidden="true" data-robot-kind="css">
      <div className="robot__stage">
        <span className="robot__antenna robot__antenna--left" />
        <span className="robot__antenna robot__antenna--right" />
        <span className="robot__head">
          <span className="robot__visor">
            <span className="robot__eye" />
            <span className="robot__eye" />
          </span>
        </span>
        <span className="robot__neck" />
        <span className="robot__arm robot__arm--left">
          <span className="robot__hand" />
        </span>
        <span className="robot__arm robot__arm--right">
          <span className="robot__hand" />
        </span>
        <span className="robot__body">
          <span className="robot__panel">
            <span />
            <span />
          </span>
          <span className="robot__door" />
        </span>
        <span className="robot__leg robot__leg--left" />
        <span className="robot__leg robot__leg--right" />
      </div>
    </div>
  );
}
