type BttProps = React.JSX.IntrinsicElements["button"];

export function Button(props: BttProps) {
  const { className, ...rest } = props;

  const clssArr = ["btn"];

  if (className) {
    clssArr.push(className);
  }

  return <button {...rest} className={clssArr.join(" ")} />;
}
