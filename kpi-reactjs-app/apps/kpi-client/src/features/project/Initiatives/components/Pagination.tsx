import React from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  place-items: center;
`;

interface ContainerProps {
  paddingLeft: number;
  paddingRight: number;
}
const Container = styled.ul<ContainerProps>`
  display: flex;
  padding-left: 0;
  list-style: none;
  border-radius: .25rem;
  padding-right: 0px;
  padding-left: ${props => props.paddingLeft}px;
  padding-right: ${props => props.paddingRight}px;
`;

interface PageItemProps {
  active: boolean;
}
const PageItem = styled.li<PageItemProps>`
  & :first-child {
    margin-left: 0;
    border-top-left-radius: .25rem;
    border-bottom-left-radius: .25rem;
  }
  & :last-child {
    border-top-right-radius: .25rem;
    border-bottom-right-radius: .25rem;
  }
  ${props => props.active && (`
    & > a {
      z-index: 3;
      color: #fff;
      background-color: #236a98;
      border-color: #236a98;
    }
  `)}
`;

const PageLink = styled.a`
  position: relative;
  display: block;
  padding: .5rem .75rem;
  margin-left: -1px;
  line-height: 1.25;
  color: #5d78ff;
  background-color: #fff;
  border: 1px solid #ebedf2;
  width: 30px;
  display: flex;
  place-items: center;
  flex-direction: column;
`;

interface PaginationItemProps {
  char: string;
  active: boolean;
  onClick: () => {};
}
const PaginationItem = (props: PaginationItemProps) => {
  const { char, active, onClick } = props;
  return (
    <PageItem active={active}>
      <PageLink onClick={onClick}>
        <span aria-hidden="true">{char}</span>
      </PageLink>
    </PageItem>
  );
}

interface PageInfo {
  char: string;
  target: number;
  active: boolean;
}
const getPageInfo = (cur: number, total: number): PageInfo[] => {
  const ret: PageInfo[] = [];
  ret.push({ char: '«', target: 1, active: false });
  ret.push({ char: '‹', target: cur - 1, active: false });
  if (cur > 1) {
    if (cur > 5) {
      ret.push({ char: '1', target: 1, active: false });
      ret.push({ char: '…', target: cur - 3, active: false });
      ret.push({ char: (cur - 2).toString(), target: cur - 2, active: false });
      ret.push({ char: (cur - 1).toString(), target: cur - 1, active: false });
    }
    else {
      for (let i = 1 ; i < cur ; i ++) {
        ret.push({ char: i.toString(), target: i, active: false });
      }
    }
  }
  ret.push({ char: cur.toString(), target: cur, active: true });
  if (cur < total) {
    if (cur < total - 4) {
      ret.push({ char: (cur + 1).toString(), target: cur + 1, active: false });
      ret.push({ char: (cur + 2).toString(), target: cur + 2, active: false });
      ret.push({ char: '…', target: cur + 3, active: false });
      ret.push({ char: total.toString(), target: total, active: false });
    }
    else {
      for (let i = cur + 1 ; i <= total ; i ++) {
        ret.push({ char: i.toString(), target: i, active: false });
      }
    }
  }
  ret.push({ char: '›', target: cur + 1, active: false });
  ret.push({ char: '»', target: total, active: false });
  return ret;
}
interface PaginationProps {
  cur: number;
  total: number;
  onChange: (cur: number) => {};
}
export default function Pagination(props: PaginationProps) {
  const { cur, total, onChange } = props;
  const pageInfo = getPageInfo(cur, total);
  return (
    <Wrapper>
      <Container
        paddingRight={(5 - cur) * 30}
        paddingLeft={(cur - total + 4) * 30}
      >
        {
          pageInfo.map( (item, index) => {
            return (
              <PaginationItem
                key={index}
                char={item.char} 
                active={item.active}
                onClick={() => {
                  if (item.target == cur || item.target < 1 || item.target > total) return false;
                  return onChange(item.target);
                }}
              />
            )
          })
        }
      </Container>
    </Wrapper>
  );
}