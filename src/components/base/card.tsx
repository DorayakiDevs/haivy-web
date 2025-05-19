type Props = {} & React.JSX.IntrinsicElements["div"];

export function Card(props: Props) {
  const { className, ...rest } = props;

  const clssArr = ["card bg-base-100"];

  if (className) {
    clssArr.push(className);
  }

  return <div className={clssArr.join(" ")} {...rest} />;
}
