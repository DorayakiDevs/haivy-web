type T_Props = React.JSXProps<"span">;

export default function Badge(props: T_Props) {
  const { className, ...rest } = props;

  const clssArr = ["badge mr-1"];

  if (className) {
    clssArr.push(className);
  }

  return <span className={clssArr.join(" ")} {...rest} />;
}
