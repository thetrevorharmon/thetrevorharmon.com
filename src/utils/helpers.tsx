const checkHttp = (link: string) => {
  const completeProtocol = /^https?/;
  const hasProtocol = completeProtocol.test(link);

  if (hasProtocol) {
    return link;
  }

  const partialProtocol = /^:?\/\//;
  const preparedLink = link.replace(partialProtocol, '');

  return `https://${preparedLink}`;
};

export {checkHttp};
