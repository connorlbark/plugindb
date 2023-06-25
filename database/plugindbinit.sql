DROP DATABASE IF EXISTS plugindb;
CREATE DATABASE plugindb;

USE plugindb;

###################################################################
##                                                               ##
##                        CREATE TABLES                          ##
##                                                               ##
###################################################################

CREATE TABLE tag (
	tag VARCHAR(100) PRIMARY KEY,
    color VARCHAR(7) NOT NULL
);

CREATE TABLE sample_pack (
	sample_pack_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    url VARCHAR(120),
    license TEXT NOT NULL
);

CREATE TABLE sample (
	sample_id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255),
    filepath VARCHAR(512) UNIQUE NOT NULL,
    sample_pack_id INT,
    CONSTRAINT fk_sample_sample_pack
		FOREIGN KEY (sample_pack_id)
        REFERENCES sample_pack(sample_pack_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE sample_tag_map (
	sample_id INT NOT NULL,
    tag VARCHAR(100) NOT NULL,

	PRIMARY KEY (sample_id, tag),
    
    CONSTRAINT fk_tag_map_sample
		FOREIGN KEY (sample_id)
        REFERENCES sample(sample_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
	
    CONSTRAINT fk_map_sample_tag
		FOREIGN KEY (tag)
		REFERENCES tag(tag)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE developer (
	developer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE plugin (
	plugin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL UNIQUE,
    developer_id INT,
    version VARCHAR(20),
    
    CONSTRAINT fk_plugin_developer
		FOREIGN KEY (developer_id)
        REFERENCES developer(developer_id)
        ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE plugin_tag_map (
	plugin_id INT NOT NULL,
    tag VARCHAR(100) NOT NULL,

	PRIMARY KEY (plugin_id, tag),
    
    CONSTRAINT fk_tag_map_plugin
		FOREIGN KEY (plugin_id)
        REFERENCES plugin(plugin_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
	
    CONSTRAINT fk_map_plugin_tag
		FOREIGN KEY (tag)
		REFERENCES tag(tag)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE preset (
	preset_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    filepath VARCHAR(120),
    plugin_id INT NOT NULL,
    CONSTRAINT uniq_unique_plugin_preset
		UNIQUE (name, plugin_id),
    CONSTRAINT fk_preset_plugin
		FOREIGN KEY (plugin_id)
        REFERENCES plugin(plugin_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE preset_tag_map (
	preset_id INT NOT NULL,
    tag VARCHAR(100) NOT NULL,

	PRIMARY KEY (preset_id, tag),
    
    CONSTRAINT fk_map_preset
		FOREIGN KEY (preset_id)
        REFERENCES preset(preset_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
	
    CONSTRAINT fk_map_preset_tag
		FOREIGN KEY (tag)
		REFERENCES tag(tag)
        ON DELETE CASCADE ON UPDATE CASCADE
);

###################################################################
##                                                               ##
##                      CREATE PROCEDURES                        ##
##                                                               ##
###################################################################

DROP PROCEDURE IF EXISTS createDeveloper;
DELIMITER //
CREATE PROCEDURE createDeveloper(IN name_var VARCHAR(120))
BEGIN
	INSERT INTO developer (name) VALUES (name_var);
    SELECT LAST_INSERT_ID() AS developer_id;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS createPlugin;
DELIMITER //
CREATE PROCEDURE createPlugin(IN name_var VARCHAR(120), IN developer_name_var VARCHAR(120), IN version_Var VARCHAR(20))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE developer_id_var INT;

	IF (developer_name_var IS NOT NULL) THEN
		SELECT developer_id INTO developer_id_var FROM developer WHERE name = developer_name_var;
        
        IF (developer_id_var IS NULL) THEN
			CALL createDeveloper(developer_name_var);
			SELECT developer_id INTO developer_id_var FROM developer WHERE name = developer_name_var;
        END IF;
	END IF;

	INSERT INTO plugin (name, developer_id, version) VALUES (name_var, developer_id_var, version_var);
	SELECT LAST_INSERT_ID() AS plugin_id;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS updatePlugin;
DELIMITER //
CREATE PROCEDURE updatePlugin(IN name_var VARCHAR(120), IN developer_name_var VARCHAR(120), IN version_Var VARCHAR(20))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE developer_id_var INT;

	IF (developer_name_var IS NOT NULL) THEN
		SELECT developer_id INTO developer_id_var FROM developer WHERE name = developer_name_var;
        
        IF (developer_id_var IS NULL) THEN
			CALL createDeveloper(developer_name_var);
			SELECT developer_id INTO developer_id_var FROM developer WHERE name = developer_name_var;
        END IF;
	END IF;

	UPDATE plugin SET developer_id=developer_id_var, version=version_var WHERE name = name_var;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS updateSample;
DELIMITER //
CREATE PROCEDURE updateSample(IN filepath_var VARCHAR(120), IN sample_pack_name_var VARCHAR(255), IN description_var VARCHAR(255))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE sample_pack_id_var INT;

	IF (sample_pack_name_var IS NOT NULL) THEN
		SELECT sample_pack_id INTO sample_pack_id_var FROM sample_pack WHERE name = sample_pack_name_var;
        
        IF (sample_pack_id_var IS NULL) THEN
			SIGNAL not_found_err;
        END IF;
	END IF;

	UPDATE sample SET sample_pack_id=sample_pack_id_var, description=description_var WHERE filepath=filepath_var;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS updatePreset;
DELIMITER //
CREATE PROCEDURE updatePreset(IN plugin_name_var VARCHAR(120), IN name_var VARCHAR(120), IN filepath_var VARCHAR(120))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE plugin_id_var INT;

	IF (plugin_name_var IS NOT NULL) THEN
		SELECT plugin_id INTO plugin_id_var FROM plugin WHERE name = plugin_name_var;
        
        IF (plugin_id_var IS NULL) THEN
			SIGNAL not_found_err;
        END IF;
	END IF;

	UPDATE preset SET plugin_id=plugin_id_var, filepath=filepath_var WHERE name=name_var;
END//
DELIMITER ;


DROP PROCEDURE IF EXISTS createTag;
DELIMITER //
CREATE PROCEDURE createTag(IN tag_var VARCHAR(100), IN color_var VARCHAR(7))
BEGIN
	DECLARE tag_exists_var VARCHAR(100);
	SELECT tag INTO tag_exists_var FROM tag WHERE tag=tag_var;
    
    IF (tag_exists_var IS NOT NULL) THEN
		UPDATE tag SET color=color_var WHERE tag=tag_var;
        SELECT tag_var AS tag_id;
	ELSE
    	INSERT INTO tag (tag, color) VALUES (tag_var, color_var);
		SELECT LAST_INSERT_ID() AS tag_id;
    END IF;


END//
DELIMITER ;

DROP PROCEDURE IF EXISTS clearPluginTags;
DELIMITER //
CREATE PROCEDURE clearPluginTags(IN plugin_name_var VARCHAR(120))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE plugin_id_var INT;

	SELECT plugin_id INTO plugin_id_var FROM plugin WHERE name = plugin_name_var;
	
	IF (plugin_id_var IS NULL) THEN
		SIGNAL not_found_err;
	END IF;
    

	DELETE FROM plugin_tag_map WHERE plugin_id = plugin_id_var;
END//
DELIMITER ;


DROP PROCEDURE IF EXISTS clearPresetTags;
DELIMITER //
CREATE PROCEDURE clearPresetTags(IN preset_name_var VARCHAR(120))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE preset_id_var INT;

	SELECT preset_id INTO preset_id_var FROM preset WHERE name = preset_name_var;
	
	IF (preset_id_var IS NULL) THEN
		SIGNAL not_found_err;
	END IF;
    

	DELETE FROM preset_tag_map WHERE preset_id = preset_id_var;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS clearSampleTags;
DELIMITER //
CREATE PROCEDURE clearSampleTags(IN sample_filepath_var VARCHAR(120))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE sample_id_var INT;

	SELECT sample_id INTO sample_id_var FROM sample WHERE filepath = sample_filepath_var;
	
	IF (sample_id_var IS NULL) THEN
		SIGNAL not_found_err;
	END IF;
    

	DELETE FROM sample_tag_map WHERE sample_id = sample_id_var;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS tagPlugin;
DELIMITER //
CREATE PROCEDURE tagPlugin(IN plugin_name_var VARCHAR(120), IN tag_var VARCHAR(120))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE plugin_id_var INT;

	SELECT plugin_id INTO plugin_id_var FROM plugin WHERE name = plugin_name_var;
	
	IF (plugin_id_var IS NULL) THEN
		SIGNAL not_found_err;
	END IF;
    

	INSERT INTO plugin_tag_map (plugin_id, tag) VALUES (plugin_id_var, tag_var);
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS createPreset;
DELIMITER //
CREATE PROCEDURE createPreset(IN plugin_name_var VARCHAR(120), IN name_var VARCHAR(120), IN filepath_var VARCHAR(120))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE plugin_id_var INT;

	SELECT plugin_id INTO plugin_id_var FROM plugin WHERE name = plugin_name_var;

	IF (plugin_id_var IS NULL) THEN
		SIGNAL not_found_err;
	END IF;

	INSERT INTO preset (name, plugin_id, filepath) VALUES (name_var, plugin_id_var, filepath_var);
	SELECT LAST_INSERT_ID() AS preset_id;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS tagPreset;
DELIMITER //
CREATE PROCEDURE tagPreset(IN plugin_name_var VARCHAR(120), IN preset_name_var VARCHAR(120), IN tag_var VARCHAR(120))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE preset_id_var INT;

	SELECT pr.preset_id INTO preset_id_var FROM preset pr
		INNER JOIN plugin pl ON pl.plugin_id = pr.plugin_id 
		WHERE pr.name = preset_name_var AND pl.name = plugin_name_var;
	
	IF (preset_id_var IS NULL) THEN
		SIGNAL not_found_err;
	END IF;
    

	INSERT INTO preset_tag_map (preset_id, tag) VALUES (preset_id_var, tag_var);
	SELECT LAST_INSERT_ID() AS preset_tag_map_id;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS createSamplePack;
DELIMITER //
CREATE PROCEDURE createSamplePack(IN name_var VARCHAR(200), IN description_var TEXT, IN url_var VARCHAR(120), IN license_var TEXT)
BEGIN
	INSERT INTO sample_pack (name, description, url, license) VALUES (name_var, description_var, url_var, license_var);
    SELECT LAST_INSERT_ID() AS sample_pack_id;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS updateSamplePack;
DELIMITER //
CREATE PROCEDURE updateSamplePack(IN name_var VARCHAR(200), IN description_var TEXT, IN url_var VARCHAR(120), IN license_var TEXT)
BEGIN
	UPDATE sample_pack SET description=description_var, url=url_var, license=license_var WHERE name=name_var;
END//
DELIMITER ;


DROP PROCEDURE IF EXISTS createSample;
DELIMITER //
CREATE PROCEDURE createSample(IN sample_pack_name_var VARCHAR(200), IN filepath_var VARCHAR(512), IN description_var VARCHAR(255))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE pack_id_var INT;

	IF (sample_pack_name_var IS NOT NULL) THEN
		SELECT sample_pack_id INTO pack_id_var FROM sample_pack WHERE name = sample_pack_name_var;
        
        IF (pack_id_var IS NULL) THEN
			SIGNAL not_found_err;
        END IF;
	END IF;

	INSERT INTO sample (filepath, description, sample_pack_id) VALUES (filepath_var, description_var, pack_id_var);
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS tagSample;
DELIMITER //
CREATE PROCEDURE tagSample(IN filepath_var VARCHAR(512), IN tag_var VARCHAR(120))
BEGIN
	DECLARE not_found_err CONDITION FOR SQLSTATE '22012';
	DECLARE sample_id_var INT;

	SELECT sample_id INTO sample_id_var FROM sample WHERE filepath = filepath_var;
	
	IF (sample_id_var IS NULL) THEN
		SIGNAL not_found_err;
	END IF;
    

	INSERT INTO sample_tag_map (sample_id, tag) VALUES (sample_id_var, tag_var);
END//
DELIMITER ;

###################################################################
##                                                               ##
##                     INSERT EXAMPLE DATA                       ##
##                                                               ##
###################################################################

# SKETCH CASSETTE
CALL createTag("Analog Simulator", "#FFCCAA");
CALL createTag("Color", "#FF004D");
CALL createTag("Drum Bus", "#C2C3C7");

CALL createDeveloper("Aberrant DSP");

CALL createPlugin("Sketch Cassette", "Aberrant DSP", NULL);

CALL tagPlugin("Sketch Cassette", "Color");
CALL tagPlugin("Sketch Cassette", "Analog Simulator");

CALL createPreset("Sketch Cassette", "Lofi Drums", NULL);

CALL tagPreset("Sketch Cassette", "Lofi Drums", "Drum Bus");

# SHAPESHIFTER

CALL createTag("Compression", "#5F574F");
CALL createTag("Extreme Compression", "#5F574F");


CALL createPlugin("ShapeShifter", "Aberrant DSP", NULL);

CALL tagPlugin("ShapeShifter", "Analog Simulator");

CALL createPreset("ShapeShifter", "Loveless", NULL);

CALL tagPreset("ShapeShifter", "Loveless", "Extreme Compression");

# RC-20

CALL createDeveloper("XLN Audio");

CALL createPlugin("RC-20 Retro Color", "XLN Audio", "1.2.0");

CALL tagPlugin("RC-20 Retro Color", "Color");
CALL tagPlugin("RC-20 Retro Color", "Analog Simulator");

# Wavetable

CALL createTag("Synthesizer", "#1D2B53");
CALL createTag("Wavetable Synth", "#1D2B53");
CALL createTag("Brass", "#FFA300");


CALL createDeveloper("Ableton");

CALL createPlugin("Wavetable", "Ableton", NULL);

CALL tagPlugin("Wavetable", "Synthesizer");
CALL tagPlugin("Wavetable", "Wavetable Synth");

CALL createPreset("Wavetable", "Doremi Tuba", "/Users/connorbarker/Music/Ableton/User Library/custom_presets/wavetable/doremi tuba.adv");

CALL tagPreset("Wavetable", "Doremi Tuba", "Brass");


# Valhalla

CALL createDeveloper("Valhalla DSP");

CALL createPlugin("VintageVerb", "Valhalla", NULL);

CALL createTag("Reverb", "#1D2B53");

CALL tagPlugin("VintageVerb", "Reverb");

CALL createPlugin("Supermassive", "Valhalla", NULL);

CALL createTag("Huge Space", "#1D2B53");

CALL tagPlugin("Supermassive", "Reverb");

CALL tagPlugin("Supermassive", "Huge Space");


# DMX FROM MARS

CALL createSamplePack(
	"DMX From Mars", 
	"The DMX is an 8 bit eprom-based drum machine developed in 1981, featuring acoustic drum samples and a warm, analog filter. The DMX is just about the closest you can get to the sound of a Linn LM1 without spending a mortgage on a drum machine. The drums are punchy and funky, instantly recognizable, and fully tune-able via internal trimmers.",
    "https://samplesfrommars.com/products/dmx-from-mars",
    "Paid");


CALL createSample(
	"DMX From Mars",
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/mars/DX From Mars/WAV/Individual Hits/2. Snare/Clean/Snare_DX_1.wav",
    "Clean Snare"
);

CALL createTag("One-Shot", "#FFF1E8");
CALL createTag("Snare", "#FF004D");
CALL createTag("Kick", "#FF004D");
CALL createTag("Closed HH", "#FFF1E8");

CALL tagSample(
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/mars/DX From Mars/WAV/Individual Hits/2. Snare/Clean/Snare_DX_1.wav",
	"One-Shot"
);

CALL tagSample(
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/mars/DX From Mars/WAV/Individual Hits/2. Snare/Clean/Snare_DX_1.wav",
	"Snare"
);

CALL createSample(
	"DMX From Mars",
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/mars/DX From Mars/WAV/Individual Hits/1. Kick/Clean/Kick_DX_1.wav",
    "Clean Kick"
);

CALL tagSample(
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/mars/DX From Mars/WAV/Individual Hits/1. Kick/Clean/Kick_DX_1.wav",
	"One-Shot"
);

CALL tagSample(
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/mars/DX From Mars/WAV/Individual Hits/1. Kick/Clean/Kick_DX_1.wav",
	"Kick"
);

CALL createSamplePack(
	"Stones Throw Drum Kit", 
	NULL,
	NULL,
    "CC0");

CALL createSample(
	"Stones Throw Drum Kit",
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/kits/Stones Throw Drum Kit/2 Funk Kit Samples/Snare Funk 2.wav",
    "Funk Snare"
);

CALL tagSample(
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/kits/Stones Throw Drum Kit/2 Funk Kit Samples/Snare Funk 2.wav",
	"Snare"
);

CALL tagSample(
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/kits/Stones Throw Drum Kit/2 Funk Kit Samples/Snare Funk 2.wav",
	"One-Shot"
);

CALL createSample(
	"Stones Throw Drum Kit",
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/kits/Stones Throw Drum Kit/2 Funk Kit Samples/Kick Funk 7.wav",
    "Funk Kick"
);

CALL tagSample(
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/kits/Stones Throw Drum Kit/2 Funk Kit Samples/Kick Funk 7.wav",
	"Kick"
);

CALL tagSample(
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/kits/Stones Throw Drum Kit/2 Funk Kit Samples/Kick Funk 7.wav",
	"One-Shot"
);

CALL createSample(
	"Stones Throw Drum Kit",
    "/Users/connorbarker/Music/Ableton/User Library/9 unsorted/Samples/kits/Stones Throw Drum Kit/Swagged Out Kit Samples/ClosedHH SwaggedOut 1.wav",
    "Closed HH Burst"
);





