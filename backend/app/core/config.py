from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ConstructHub Backend"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str
    OLLAMA_LLM_BASE_URL: str | None = None
    OLLAMA_EMBED_BASE_URL: str | None = None
    GEMINI_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()