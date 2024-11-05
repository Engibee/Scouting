from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from pydantic import BaseModel

# Crie o app FastAPI
app = FastAPI()

# Habilite CORS com as origens permitidas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens. Substitua com URLs específicas, se necessário.
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.).
    allow_headers=["*"],  # Permite todos os cabeçalhos.
)

# Configuração do banco de dados
DATABASE_URL = "mysql+mysqlconnector://root:vyre@localhost/scoutso"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
class Base(DeclarativeBase):
    pass

# Modelo de dados do SQLAlchemy para a tabela `jogadores`
class JogadorDB(Base):
    __tablename__ = "jogadores"
    id_jogador = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), nullable=False)
    idade = Column(Integer, nullable=False)
    equipe = Column(String(50), nullable=False)
    posicao = Column(String(30), nullable=False)
    altura = Column(Float, nullable=False)
    peso = Column(Float, nullable=False)
    golsecestas_temporada = Column(Integer, nullable=False)
    assistencias_temporada = Column(Integer, nullable=False)
    jogos_disputados = Column(Integer, nullable=False)
    minutos_jogados = Column(Integer, nullable=False)
    forca = Column(Integer, nullable=False)
    agilidade = Column(Integer, nullable=False)
    velocidade = Column(Integer, nullable=False)
    resistencia = Column(Integer, nullable=False)
    controle_bola = Column(Integer, nullable=False)
    esporte = Column(String(20), nullable=False)
# Crie as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Modelo Pydantic para o usuário (entrada e saída de dados)
class Jogador(BaseModel):
    nome: str
    idade: int
    equipe: str
    posicao: str
    altura: float
    peso: float
    golsecestas_temporada: int
    assistencias_temporada: int
    jogos_disputados: int
    minutos_jogados: int
    forca: int
    agilidade: int
    velocidade: int
    resistencia: int
    controle_bola: int
    esporte: str

    class Config:
        from_attributes = True

# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint para obter todos os jogadores
@app.get("/jogadores", response_model=list[Jogador])
def obter_jogadores(db: Session = Depends(get_db)):
    return db.query(JogadorDB).all()

# Endpoint para adicionar um novo jogador
@app.post("/jogadores", response_model=Jogador)
def adicionar_jogador(jogador: Jogador, db: Session = Depends(get_db)):
    db_jogador = JogadorDB(**jogador.dict())
    db.add(db_jogador)
    db.commit()
    db.refresh(db_jogador)
    return db_jogador

#.\.venv\Scripts\activate
#uvicorn main:app --reload