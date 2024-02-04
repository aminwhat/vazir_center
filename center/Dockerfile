#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
LABEL org.opencontainers.image.source = "https://github.com/aminwhat/vazir_center"
USER app
WORKDIR /app
EXPOSE 3779
EXPOSE 3780

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["center/center.csproj", "center/"]
RUN dotnet restore "./center/./center.csproj"
COPY . .
WORKDIR "/src/center"
RUN dotnet build "./center.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./center.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
RUN mv .env.production .env
ENTRYPOINT ["dotnet", "center.dll"]