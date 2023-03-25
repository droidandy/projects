import styled from "styled-components";

import { NavLink } from "react-router-dom";

import { color, device, f_c_sb, hShadow, transition } from "../../../../components/styles";

export const Section = styled.div``;

export const ArticleBlock = styled.div`
    margin: 0 auto;
    flex-direction: column;
    padding-top: 10px;
    flex-wrap: wrap;
    ${f_c_sb}

    @media ${device.laptop} {
        
    }
`;

export const NoArticleFound = styled.div`
    display: block;
    margin: auto;
    font-size: 16px;
    color: ${color.grey};
    text-align: center;
`;
