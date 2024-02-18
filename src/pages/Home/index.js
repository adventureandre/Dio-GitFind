import React, { useState } from "react";
import { Header } from "../../components/Header";
import background from "../../assets/background.png";
import ItemList from "../../components/ItemList";
import "./styles.css";
import { useQuery } from "@tanstack/react-query";



function fetchUserData(username) {
  return fetch(`https://api.github.com/users/${username}`).then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao carregar dados do usuário");
    }
    return response.json();
  });
}

function App() {
  const [user, setUser] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false)

  const {
    data: currentUser,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useQuery({
    queryKey: ["userData", user],
    queryFn: () => fetchUserData(user),
    enabled: !!user && isSubmiting,
  });

  const {
    data: repos,
    isLoading: reposIsLoading,
    isError: reposIsError,
  } = useQuery({
    queryKey: ["userRepos", user],
    queryFn: () =>
      fetchUserData(user).then((userData) => {
        if (userData.repos_url) {
          return fetch(userData.repos_url).then((response) => response.json());
        }
        return [];
      }),

    enabled: !!user && !!currentUser?.repos_url && isSubmiting,
  });

  const handleGetData = () => {
    setIsSubmiting(true)
  };

  return (
    <div className="App">
      <Header />
      <div className="conteudo">
        <img src={background} className="background" alt="imagen" />
        <div className="info">
          <div>
            <input
              name="usuario"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              placeholder="@username"
            />
            <button onClick={handleGetData}>Buscar</button>
          </div>
          {userIsError && <div>Erro ao carregar dados do usuário</div>}
          {userIsLoading && <div>Carregando dados do usuário...</div>}
          {currentUser && (
            <>
              <div className="perfil">
                <img
                  src={currentUser.avatar_url}
                  className="profile"
                  alt={currentUser.name}
                />
                <div>
                  <h3>{currentUser.name}</h3>
                  <span>@{currentUser.login}</span>
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          )}
          {reposIsError && <div>Erro ao carregar repositórios do usuário</div>}
          {reposIsLoading && <div>Carregando repositórios do usuário...</div>}
          {repos && repos.length > 0 && (
            <div>
              <h4 className="repositorio">Repositórios</h4>
              {repos.slice(0, 5).map((repo) => (
                <ItemList
                  key={repo.id}
                  title={repo.name}
                  description={repo.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
