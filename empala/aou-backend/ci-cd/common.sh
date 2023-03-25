#!/bin/sh

w="\e[0m";
r="\e[0;31m";
y="\e[1;33m";
g="\e[1;32m";
echo_r() { /bin/echo -e "$r$1$w";  };
echo_y() { /bin/echo -e "$y$1$w";  };
echo_g() { /bin/echo -e "$g$1$w";  };
