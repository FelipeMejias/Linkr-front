import { useState, useContext } from "react";
import { DebounceInput } from "react-debounce-input";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { IconContext } from "react-icons";
import { AiOutlineSearch } from "react-icons/ai";

import { getUsersByName } from "../services/api";
import TokenContext from "../contexts/TokenContext";
import UserContext from "../contexts/UserContext";

const MIN_LENGTH_SEARCH = 3;
const DEBOUNCE_TIME = 300;

export default function SearchBar() {
  const { token } = useContext(TokenContext);
  const { user } = useContext(UserContext);
  const [filteredData, setFilteredData] = useState([]);

  const navigate = useNavigate();

  async function handleFilter(event) {
    const searchWord = event.target.value;

    if (searchWord.length < MIN_LENGTH_SEARCH) {
      hideResults();
    } else {
      try {
        const response = await getUsersByName(searchWord, token);
        const users = response.data;
        setFilteredData(users);
      } catch (error) {
        alert(
          "An error occured while trying to fetch the users, please refresh the page."
        );
      }
    }
  }

  function hideResults() {
    setFilteredData([]);
  }

  const searchResults = filteredData.map((userData, index) => {
    return (
      <User
        key={index}
        onMouseDown={() => {
          navigate(`/user/${userData.id}`);
        }}
      >
        <img src={userData.pictureURL} alt="user icon" />
        <span>
          {userData.name}{" "}
          {userData.followers.includes(user.id) ? (
            <span style={{ color: "#C5C5C5", fontSize: "18px" }}>
              • following
            </span>
          ) : (
            ""
          )}
        </span>
      </User>
    );
  });

  return (
    <Content className="search" onBlur={hideResults}>
      <SearchInputs>
        <DebounceInput
          type="text"
          placeholder="Search for people"
          minLength={MIN_LENGTH_SEARCH}
          debounceTimeout={DEBOUNCE_TIME}
          onChange={handleFilter}
          onFocus={handleFilter}
        />
        <IconContext.Provider value={{ className: "icon" }}>
          <AiOutlineSearch />
        </IconContext.Provider>
      </SearchInputs>
      {filteredData.length !== 0 && (
        <SearchResults>{searchResults}</SearchResults>
      )}
    </Content>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #e7e7e7;
  border-radius: 8px;
  max-width: 563px;

  z-index: 1;
`;

const SearchInputs = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  input {
    width: 100%;
    height: 45px;

    display: flex;
    align-items: center;
    padding-left: 17px;

    font-family: "Lato";
    font-size: 19px;
    line-height: 23px;

    background: #ffffff;
    border: none;
    border-radius: 8px;

    @media (max-width: 613px) {
      font-size: 17px;
      line-height: 20px;
    }
  }

  input::placeholder {
    color: #c6c6c6;
  }

  input:focus {
    outline: none;
  }

  .icon {
    position: absolute;
    top: 9px;
    right: 23px;

    font-size: 27px;
    color: #c6c6c6;
  }
`;

const SearchResults = styled.div`
  width: 100%;
  height: fit-content;
  max-height: 135px;
  overflow: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const User = styled.div`
  width: 100%;
  height: 65px;
  display: flex;
  align-items: center;

  cursor: pointer;

  img {
    height: 39px;
    max-width: 39px;
    border-radius: 50%;
    object-fit: cover;
    margin-left: 17px;
  }

  span {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400;
    font-size: 19px;
    line-height: 23px;
    color: #515151;
    margin-left: 12px;
  }

  &:hover {
    background-color: lightgrey;
  }
`;
