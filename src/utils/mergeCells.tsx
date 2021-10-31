const mergeCells = (data: any[]) => {
  return data
    .reduce((result, item) => {
      //首先将name字段作为新数组result取出
      if (result.indexOf(item.number) < 0) {
        result.push(item.number);
      }
      return result;
    }, [])
    .reduce((result: any[], name: any) => {
      //将name相同的数据作为新数组取出，并在其内部添加新字段**rowSpan**
      const children = data.filter((item) => item.number === name);
      return result.concat(
        children.map((item, index) => ({
          ...item,
          rowSpan: index === 0 ? children.length : 0, //将第一行数据添加rowSpan字段
        })),
      );
    }, []);
};

export default mergeCells;
