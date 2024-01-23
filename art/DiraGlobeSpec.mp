% Dira Globe sketch & specifications
% ujr/2024-01-21

outputtemplate := "%j-%c.mps";

% Note: fullcircle has length 8 (four quartercircles of length 2)
vardef arc(expr b,l) =
  if l < 0: subpath (0, -l/45) of ((reverse fullcircle) rotated b)
  else: subpath (0, l/45) of (fullcircle rotated b) fi
enddef;

def markpoint(expr p) =
  begingroup interim linecap := rounded;
  draw p withpen pencircle scaled 3.2pt;
  undraw p withpen pencircle scaled 1.6pt;
  endgroup
enddef;

beginfig(1)
numeric u; u := 4.5pt;
numeric pi; pi := 3.1415927;
numeric r, a, b, s, d, h, w, tilt, phi;
r = 10u; a = r+2u; b = a+2u; % radii
s = .92r; % needle size, slightly smaller than r
tilt = 23.4; phi = 58; % axial tilt and needle angle
w = 1.0u; % stroke width
color needle_blue; needle_blue = (28/256,74/256,155/256);
color anno_pink; anno_pink = (216/256, 61/256, 155/256);
path needle;
needle := s*left{dir20}  .. .25s*up   .. {dir-20}right*s ..
          s*right{dir200}.. .25s*down .. {dir160}left*s .. cycle;
pickup pencircle scaled w;

% Globe (a circle):
draw fullcircle scaled 2r;

% Axle (only visible parts N and S):
interim linecap := rounded;
draw (origin -- (a-r)*down) shifted (0,-r) rotated tilt;
draw (origin -- (a-r)*up) shifted (0,r) rotated tilt;

% Needle (in "Dira blue"):
fill needle rotated phi withcolor needle_blue;
unfill fullcircle scaled .25s;

% Support:
interim linecap := butt;
draw arc(90+tilt-10, 180+20) scaled 2a;

% Pedestal:
draw (1/3r*left -- 1/3r*right) shifted (0, -b);
draw (a*down -- b*down) withpen pencircle scaled 2w;

% Annotation (in pink, not part of logo):
pickup pencircle scaled .5pt;
drawoptions(withcolor anno_pink);
draw (origin -- left) xscaled 1.55r;
 %label.lft(btex $0$ etex, origin shifted (-1.55r, 0));
drawarrow (origin -- r*down) shifted (-1.5r, 0);
 draw (origin -- left) xscaled 1.55r shifted (0, -r);
 label.lft(btex $r$ etex, origin shifted (-1.55r, -r));
drawarrow (origin -- a*down) shifted (-1.4r, 0);
 draw (origin -- left) xscaled 1.45r shifted (0, -a);
 label.lft(btex $a$ etex, origin shifted (-1.4r,-a));
drawarrow (origin -- b*down) shifted (-1.3r, 0);
 draw (origin--left) xscaled 1.35r shifted (0, -b);
 label.lft(btex $b$ etex, origin shifted (-1.35r, -b));
draw (a*down -- 1.1b*up) rotated tilt; % axle
draw (1.2b*down -- 1.3a*up); % vertical
draw (s*left -- 1.3r*right) rotated phi; % needle
drawarrow arc(90,tilt) scaled 2.3a;
label.top(btex $23.4^\circ$ etex, point .5 of (arc(90,tilt) scaled 2.3a));
drawarrow arc(90,phi-90) scaled 2.4r;
label.top(btex $32^\circ$ etex, point .5 of (arc(90,phi-90) scaled 2.4r));
markpoint(origin);
markpoint(origin shifted (0,-r));
markpoint(origin shifted (0,-a));
markpoint(origin shifted (0,-b));
label.rt(btex $w$ etex, origin shifted (r/3, -b));
label.rt(btex $w$ etex rotated 35, .93a*down rotated (tilt+10));
label.bot(btex $r\approx10w\quad a\approx12w\quad b\approx14w$ etex,
  origin shifted (0,-1.8r));
label.bot(btex ($w=\hbox{Strichst\"arke}$) etex, origin shifted (0,-2.1r));
drawoptions(); % reset
endfig;

end

