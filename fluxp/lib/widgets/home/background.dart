import 'package:flutter/material.dart';
import '../../common/tools.dart';
import 'package:wave/config.dart';
import 'package:wave/wave.dart';

class HomeBackground extends StatelessWidget {
  final config;

  HomeBackground({this.config});

  @override
  Widget build(BuildContext context) {
    if (config["type"] == 'wave') {
      return Container(
        height: MediaQuery.of(context).size.height * 1,
        child: WaveWidget(
          config: CustomConfig(
            gradients: [
              [Colors.purple, Colors.blue],
              [Colors.blue, Color(0xFF3CC2BF)]
            ],
            durations: [25800, 20000],
            heightPercentages: [0.07, 0.06],
            blur: MaskFilter.blur(BlurStyle.outer, 10),
            gradientBegin: Alignment.bottomLeft,
            gradientEnd: Alignment.topRight,
          ),
          waveAmplitude: 2,
          backgroundColor: Theme.of(context).backgroundColor,
          size: Size(
            double.infinity,
            double.infinity,
          ),
        ),
      );
    }
    return Container(
      height: MediaQuery.of(context).size.height * config['height'],
      decoration: BoxDecoration(
        color: config['color'] != null ? HexColor(config['color']): Theme.of(context).primaryColor,
        image: config['image'] != null
            ? DecorationImage(
                fit: BoxFit.fitHeight,
                image: NetworkImage(
                  config['image'],
                ),
              )
            : null,
      ),
    );
  }
}
