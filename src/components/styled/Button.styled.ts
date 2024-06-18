import styled, { css } from 'styled-components';

type IconButtonProps = {
  $bgColor?: string;
  $hover?: boolean;
  $selected?: boolean;
  $width?: string;
};

export const Button = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: inherit;
  justify-content: center;

  &:disabled {
    cursor: unset;
  }
`;

export const AltButton = styled(Button)`
  border: 1px solid var(--clr-light);
  border-radius: 50px;
  color: var(--clr-light);
  height: 50px;
  width: 250px;

  &:disabled {
    opacity: 0.4;
  }
`;

export const DialogButton = styled(Button)`
  border: 1px solid var(--clr-a);
  border-radius: 4px;
  height: 40px;
  transition: background-color 200ms ease;
  width: 60px;

  &:hover:not(:disabled) {
    background-color: var(--clr-a);
  }
`;

export const DropdownButton = styled(Button)`
  background-color: var(--clr-c);
  color: var(--clr-light);
  justify-content: flex-start;
  letter-spacing: 1px;
  padding: 10px 20px;

  &:hover {
    background-color: var(--clr-b);
  }
`;

export const IconButton = styled(Button)<IconButtonProps>`
  aspect-ratio: 1 / 1;
  background-color: ${({ $bgColor }) => $bgColor ?? 'transparent'};
  border-radius: 50%;
  box-shadow: ${({ $bgColor }) => ($bgColor ? '0 2px 4px 0 rgb(0 0 0 / 20%)' : 'none')};
  font-size: 1.5em;
  min-width: ${({ $width }) => $width ?? '40px'};

  ${({ $hover, $selected }) =>
    $hover &&
    css`
      opacity: ${$selected ? '0.9' : '0.4'};
      transition: opacity 200ms ease;

      &:hover {
        opacity: 0.9;
      }
    `}
`;

export const MainButton = styled(Button)`
  border: 2px solid var(--clr-b);
  border-radius: 25px;
  color: var(--clr-b);
  font-size: 1.2em;
  height: 50px;
  width: 100%;

  &:disabled {
    opacity: 0.4;
  }
`;

export const SocialButton = styled(Button)`
  border: 2px solid var(--clr-light-gray);
  border-radius: 25px;
  color: var(--clr-dark);
  height: 50px;
  padding: 0 10px;
  width: 100%;

  & > span {
    flex-grow: 10;
  }
`;
