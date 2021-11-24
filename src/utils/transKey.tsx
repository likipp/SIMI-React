import mergeCells from '@/utils/mergeCells';

export const transKey = (res: any) => {
  for (let i = 0; i < res.data.length; i++) {
    res.data[i].key = res.data[i].number + res.data[i].p_number + res.data[i].id;
  }
  res.data = mergeCells(res.data);
  return res
}
