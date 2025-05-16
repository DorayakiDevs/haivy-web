type Props = React.JSX.IntrinsicElements["span"];

export default function Badge(props: Props) {
  const { className, ...rest } = props;

  const clssArr = ["badge"];

  if (className) {
    clssArr.push(className);
  }

  return <span className={clssArr.join(" ")} {...rest} />;
}
