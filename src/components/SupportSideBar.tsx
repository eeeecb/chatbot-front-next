'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled, { css } from 'styled-components';

import { Avatar, IconButton } from './styled';
import { signOut } from '@/app/actions';
import { useMainContext, useSupportList } from '@/hooks';
import type { ConversationStatus } from '@/lib/definitions';
import elapsedTime from '@/utils/elapsedTime';

const Container = styled.aside`
  background-color: var(--clr-light);
  border-right: 1px solid var(--clr-a);
  box-shadow: 1px 0 4px 0 rgb(0 0 0 / 10%);
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 360px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  height: 160px;
  justify-content: space-between;
  margin-bottom: 80px;
  padding: 20px 20px 0;

  & > h1 {
    color: var(--clr-b);
  }
`;

const List = styled.ul`
  flex-grow: 10;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--clr-c);
  }
`;

const ListItem = styled.li`
  align-items: center;
  border-bottom: 1px solid var(--clr-light-gray);
  cursor: pointer;
  display: flex;
  gap: 10px;
  padding: 20px;
  transition: background-color ease-in 200ms;

  &:hover {
    background-color: var(--clr-light-gray);
  }

  & > div:nth-child(2) {
    flex-grow: 10;

    & > span {
      font-size: 0.75rem;
    }
  }
`;

const Status = styled.div<{ $status: ConversationStatus }>`
  aspect-ratio: 1;
  background-color: var(--clr-a);
  border-radius: 50%;
  opacity: 0.8;
  width: 20px;

  ${({ $status }) =>
    $status === 'accepted' &&
    css`
      animation: pulse 1500ms infinite;
      background-color: var(--clr-b);
    `}
`;

const Footer = styled.footer`
  align-items: center;
  background-color: var(--clr-b);
  background-image: linear-gradient(
    to bottom right,
    rgba(255 255 255 / 10%),
    rgba(255 255 255 / 0%) 50%
  );
  border-top: 2px solid var(--clr-b);
  box-shadow: 0 -1px 4px 0 rgb(0 0 0 / 20%);
  color: var(--clr-light);
  display: flex;
  font-size: 0.9rem;
  height: 60px;
  justify-content: space-evenly;
`;

function SupportList() {
  const router = useRouter();
  const { supportList } = useSupportList();

  if (supportList === undefined) {
    return <List>Loading</List>;
  }

  if (supportList?.length === 0) {
    return <List>Não há nada aqui!</List>;
  }

  return (
    <List>
      {supportList?.map(({ id, status, user_profile, created_at }, index) => {
        return (
          <ListItem
            key={index}
            onClick={() => router.push(`/suporte/${id}`)}
            role="button"
            tabIndex={0}
          >
            <Avatar $fontSize="1.25rem" $picture={user_profile?.picture} $width="40px">
              {user_profile?.name.charAt(0)}
            </Avatar>
            <div>
              <div>{user_profile?.name.split(' ')[0]}</div>
              <span>{elapsedTime(created_at)}</span>
            </div>
            <Status $status={status} />
          </ListItem>
        );
      })}
    </List>
  );
}

function SupportSideBar() {
  const { user: collaborator } = useMainContext();

  return (
    <Container>
      <Header>
        <Link href={'/'}>
          <Image
            src="/home.svg"
            height={24}
            width={24}
            alt="Link para a página principal"
          />
        </Link>
        <h1>Atendimentos</h1>
      </Header>
      <SupportList />
      <Footer>
        <div>
          <div>{collaborator?.name.split(' ')[0]}</div>
          <div>{collaborator?.email}</div>
        </div>
        <IconButton onClick={() => signOut()}>
          <Image src="/logout-white.svg" height={18} width={18} alt="Botão de deslogar" />
        </IconButton>
      </Footer>
    </Container>
  );
}

export default SupportSideBar;
