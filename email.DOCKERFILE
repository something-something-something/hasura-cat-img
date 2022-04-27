FROM archlinux:latest
RUN pacman -Syu --noconfirm  postfix s-nail nano mutt bash-completion swaks nodejs npm postfix-pcre
RUN useradd -m test
#RUN useradd -m no-reply
#RUN echo "no-reply:pass" | chpasswd
RUN postalias /etc/postfix/aliases
#RUN postconf -e "always_bcc=test"
RUN echo "/.*/ test" > /etc/postfix/mytable
RUN postconf -e "virtual_alias_maps=pcre:/etc/postfix/mytable"
CMD ["postfix","-vvv", "start-fg"]
