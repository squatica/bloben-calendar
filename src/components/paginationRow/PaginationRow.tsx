import { Button, Flex } from '@chakra-ui/react';
import { Separator } from 'bloben-components';

const renderPages = (page: number, total: number, handleClick: any) => {
  const result: any = [];

  for (let i = 1; i <= total; i++) {
    const isSelected = i === Number(page);
    const variant = isSelected ? 'solid' : 'ghost';

    result.push(
      <Button
        size={'sm'}
        style={{
          width: 20,
          height: 20,
        }}
        variant={variant}
        disabled={isSelected}
        onClick={() => handleClick(i)}
      >
        {i}
      </Button>
    );
  }

  return result;
};

interface PaginationRowProps {
  page: number;
  total: number;
  nextFunc: any;
  prevFunc: any;
  clickOnNumber: any;
}
const PaginationRow = ({
  page,
  total,
  nextFunc,
  prevFunc,
  clickOnNumber,
}: PaginationRowProps) => {
  const pages = renderPages(page, total, clickOnNumber);

  return (
    <Flex direction={'row'}>
      <Button size={'sm'} onClick={prevFunc} disabled={page <= 1}>
        Previous
      </Button>
      <Separator width={6} />
      <Flex justifyContent={'center'} alignItems={'center'} direction={'row'}>
        {pages}
      </Flex>
      <Separator width={6} />

      <Button size={'sm'} onClick={nextFunc} disabled={page >= total}>
        Next
      </Button>
    </Flex>
  );
};

export default PaginationRow;
