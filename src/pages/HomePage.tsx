import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomePage = () => {
    return <>
        <Title>Welcome to VimTS</Title>
        <NavLink>
            <Link to='/playground'>Go to Playground</Link>
        </NavLink>
    </>
}

const Title = styled.h1`
  color: white;
`;

const NavLink = styled.h1`
`;

export default HomePage



