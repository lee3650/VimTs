import { Link } from 'react-router-dom';
import styled from 'styled-components';

const LearningPage = () => {
    return <>
        <Title>Welcome to the learning page</Title>
        <NavLink>
            <Link to='/'>Go back</Link>
        </NavLink>
    </>
}

const Title = styled.h1`
  color: white;
`;

const NavLink = styled.h1`
`;

export default LearningPage

