type Props = React.JSX.IntrinsicElements["span"];

export default function Badge(props: Props) {
  const { className, ...rest } = props;

  const clssArr = ["badge mr-1"];

  if (className) {
    clssArr.push(className);
  }

  return <span className={clssArr.join(" ")} {...rest} />;
}
