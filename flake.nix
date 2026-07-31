# Flake for development environment for better-containers
# Provides devShell for the browser extension and home-manager configuration

{
  description = "Flake for development environment for better-containers.";

  inputs = {
    # Nixpkgs from nixos-unstable channel
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    # Home-manager for user environment configuration
    home-manager = {
      url = "github:nix-community/home-manager";
      # Use the same nixpkgs as the main input
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, home-manager }:
  let
    pkgs = nixpkgs.legacyPackages."x86_64-linux";
    # Import all home-manager modules from ./modules
    modules = import ./modules;
  in {
    # Development shell for the browser extension project
    devShells."x86_64-linux".default = pkgs.mkShell {
      packages = with pkgs; [
        nodejs_22
        vscode-langservers-extracted
        tailwindcss-language-server
        vtsls
      ];
    };

    # Home-manager configuration for user arpit
    homeConfigurations."arpit" = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      modules = modules;
    };
  };
}
