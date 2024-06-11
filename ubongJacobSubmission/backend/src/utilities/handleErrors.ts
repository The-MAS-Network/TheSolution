interface IError {
  [x: string]: string[];
}

export const handleApiErrors = (props: any, falbackMessage?: string) => {
  const message =
    props.data?.message ??
    props.data?.error?.message ??
    getFirstErorr(props?.data?.errors) ??
    props.data?.errors?.[0] ??
    falbackMessage ??
    props.problem ??
    "FATAL: Invalid error received.";

  return message;
};

const getFirstErorr = (error: IError) => {
  if (error) {
    const values = Object.entries(error).map(([_, value]) => value);
    if (!!values?.[0]?.[0]) return values?.[0]?.[0];
    else return undefined;
  } else return undefined;
};
