{
	description = "Flake for development environment for better-containers.";

	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
	};

	outputs = { self, nixpkgs }:
	let
		pkgs = nixpkgs.legacyPackages."x86_64-linux";
	in {
		devShells."x86_64-linux".default = pkgs.mkShell {
			packages = with pkgs; [
				nodejs_22
				nodePackages.typescript-language-server
			];
		};
	};
}
