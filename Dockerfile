FROM jekyll/jekyll:latest

WORKDIR /srv/jekyll

RUN echo 'source "https://rubygems.org"' > Gemfile && \
    echo 'gem "github-pages", group: :jekyll_plugins' >> Gemfile

RUN bundle install

EXPOSE 4000